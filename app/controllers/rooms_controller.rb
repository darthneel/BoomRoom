require 'streamer/sse'

class RoomsController < ApplicationController
	include ActionController::Live
	
	def initialize_room  # main lobby
		@room = Room.find(params[:id])
		@users = @room.users
		@playlist = @room.songs.order('id')
		@this_user = current_user
	end

	def get_time # adds user
		response.headers['Content-Type'] = 'text/javascript'
		room = Room.find(params[:room_id])
		current_song = Song.where(currently_playing: true).first
		$redis.publish("add_user_#{room.id}", {user: current_user.username, id: current_user.id}.to_json)
		room.users << current_user
		if current_song
			elapsed = ((Time.now - current_song.updated_at) * 1000).to_i
			render :json => {elapsed: elapsed, sc_ident: current_song.sc_ident, title: current_song.title}
		else
			render :json => false
		end
	end

	def remove_user
		room = Room.find(params[:room_id].to_i)
		user = current_user
		room.users.delete(user)
		if room.users.length == 0
			room.songs.each do |song|
				song.destroy
			end
			
			room.destroy
		end
		$redis.publish("remove_user_#{room.id}", {user: current_user.username, id: current_user.id}.to_json)
		render nothing: true
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
		response.headers['Content-Type'] = 'text/javascript'
		room = current_user.room
		current_sc_ident = params[:current_sc_ident]
		ended_song = Song.where(sc_ident: current_sc_ident, room_id: room.id).first
		if ended_song
			ended_song.update_attributes(played: true, currently_playing: false, likes: 0, dislikes: 0)
		end
		new_song = Song.where(played: false, room_id: room.id).limit(1).first
		if new_song
			new_song.update_attributes(currently_playing: true)
			$redis.publish("change_song_#{room.id}", {sc_ident: new_song.sc_ident, title: new_song.title}.to_json)
			render nothing: true
		else
			songs = Song.where(played: true, room_id: room.id)			
			songs.each do |song|
				song.update_attributes(played: false)
			end
			new_song = Song.where(played: false, room_id: room.id).limit(1).first
			new_song.update_attributes(currently_playing: true)
			$redis.publish("change_song_#{room.id}", {sc_ident: new_song.sc_ident, title: new_song.title}.to_json)
			render nothing: true
		end
	end

	def like_or_dislike
		response.headers['Content-Type'] = 'text/javascript'
		room = current_user.room
		users = room.users.length
		current_song = Song.where(currently_playing: true).first
		likes = current_song.likes
		dislikes = current_song.dislikes
		if params[:vote] == 'like'
			likes += 1
			current_song.update_attributes(likes: likes)
			$redis.publish("like_or_dislike_#{room.id}", {vote: 'like', sc_ident: current_song.sc_ident, users: users}.to_json)
		elsif params[:vote] == 'dislike'
			dislikes += 1
			current_song.update_attributes(dislikes: dislikes)
			$redis.publish("like_or_dislike_#{room.id}", {vote: 'dislike', sc_ident: current_song.sc_ident, users: users}.to_json)
		end
		render nothing: true
	end

  def events
    response.headers['Content-Type'] = 'text/event-stream'
    room_id = params[:room_id]
    sse = Streamer::SSE.new(response.stream)
    redis ||= Redis.new 
    redis.subscribe(["add_song_#{room_id}", "add_user_#{room_id}", "change_song_#{room_id}", "remove_user_#{room_id}", "like_or_dislike_#{room_id}", "heart"]) do |on|
      on.message do |event, data|
      	if event == "add_song_#{room_id}"
      		sse.write(data, event: "add_song_#{room_id}")
      	elsif event == "add_user_#{room_id}"
        	sse.write(data, event: "add_user_#{room_id}")
        elsif event == "change_song_#{room_id}"
        	sse.write(data, event: "change_song_#{room_id}")
        elsif event == "remove_user_#{room_id}"
        	sse.write(data, event: "remove_user_#{room_id}")
        elsif event == "like_or_dislike_#{room_id}"
        	sse.write(data, event: "like_or_dislike_#{room_id}")
        elsif event == "heart"
        	sse.write(data, event: "heart")
      	end
      end
    end
  rescue IOError
    # Client disconnected
    redis.quit
    sse.close
    response.stream.close
  ensure
    redis.quit
    sse.close
    response.stream.close
  end

  def song_params
		params.require(:song).permit(:title, :artist, :stream_url, :album_art, :sc_ident, :genre)
	end

end 
