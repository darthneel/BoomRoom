require 'streamer/sse'

class RoomsController < ApplicationController
	include ActionController::Live
	

	def initialize_room  # *** Adds a user to a room
		@room = Room.find(params[:id])
		@users = @room.users
	end

	def get_time
		response.headers['Content-Type'] = 'text/javascript'
		room = Room.find(params[:room_id])
		current_song = Song.where(currently_playing: true).first
		$redis.publish("add_user_#{room.id}", {user: current_user.email, id: current_user.id}.to_json)
		room.users << current_user

		if current_song
			elapsed = ((Time.now - current_song.updated_at) * 1000).to_i
			render :json => {elapsed: elapsed, sc_ident: current_song.sc_ident}
		else
			render :json => false
		end
	end

	def add_song
		response.headers['Content-Type'] = 'text/javascript'
		room = current_user.room
		new_song_params = song_params

		if room.songs.length == 0
			new_song_params[:currently_playing] = true
		end

		@song = Song.create(new_song_params)
		room.songs << @song
    $redis.publish("add_song_#{room.id}", {title: @song.title}.to_json)
    render nothing: true
	end

	def change_song
		room = current_user.room
		current_sc_ident = params[:current_sc_ident]

		ended_song = Song.where(sc_ident: current_sc_ident, room_id: room.id).first

		if ended_song
			ended_song.update_attributes(played: true, currently_playing: false)
		end

		new_song = Song.where(played: false, room_id: room.id).limit(1).first

		if new_song
			new_song.update_attributes(currently_playing: true)
			render :json => {sc_ident: new_song.sc_ident}
		else
			songs = Song.where(played: true, room_id: room.id)
			
			songs.each do |song|
				song.update_attributes(played: false)
			end

			new_song = Song.where(played: false, room_id: room.id).limit(1).first
			new_song.update_attributes(currently_playing: true)

			# $redis.publish("#{room.id}.change_song", {sc_ident: new_song.sc_ident, room_id: room.id}.to_json)
			# render nothing: true
			render :json => {sc_ident: new_song.sc_ident}
		end
	end

	def remove_user
		room = Room.find(params[:room_id].to_i)
		user = current_user
		room.users.delete(user)

		$redis.publish("remove_user_#{room.id}", {user: current_user.email, id: current_user.id}.to_json)

		render nothing: true
	end

  def events
    response.headers['Content-Type'] = 'text/event-stream'
    # room_id = /\/rooms\/(.+)/.match(request.original_url)[1].to_i
    room_id = params[:room_id]

    puts "THIS IS THE URL: #{request.original_url}"
    puts "THIS IS THE ROOM ID: #{room_id}"

    sse = Streamer::SSE.new(response.stream)
    redis = Redis.new 
    # redis.subscribe(['rooms.add_user', 'rooms.add_song']) do |on|
    redis.subscribe(["add_song_#{room_id}", "add_user_#{room_id}", "change_song_#{room_id}", "remove_user_#{room_id}"]) do |on|
      on.message do |event, data|
      	if event == "add_song_#{room_id}"
      		sse.write(data, event: "add_song_#{room_id}")
      	elsif event == "add_user_#{room_id}"
        	sse.write(data, event: "add_user_#{room_id}")
        elsif event == "change_song_#{room_id}"
        	sse.write(data, event: "change_song_#{room_id}")
        elsif event == "remove_user_#{room_id}"
        	sse.write(data, event: "remove_user_#{room_id}")
      	end
      end
    end
    render nothing: true
  rescue IOError
    # Client disconnected
  ensure
    redis.quit
    sse.close
  end

  def song_params
		params.require(:song).permit(:title, :artist, :stream_url, :album_art, :sc_ident, :genre)
	end

end 
