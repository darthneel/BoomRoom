require 'streamer/sse'

class RoomsController < ApplicationController
	include ActionController::Live

	# before_filter :authenticate_user!

	def index
		@rooms = Room.all
	end

	def test_room
	end


	def initialize_room # *** Adds a user to a room
		@room = Room.find(params[:id])
		@room.users << current_user
	end

# Might need to be moved depending on how we want to trigger it (room show, for example)
	# def add_user
 #    if current_user
 #      response.headers['Content-Type'] = 'text/javascript'
	#     $redis.publish('rooms.add_user', {username: current_user.id, room_id: current_user.room.id}.to_json)
	#   end
 #    render nothing: true
	# end

	def get_time
		current_song = Song.where(currently_playing: true)
		elapsed = Time.now - current_song.updated_at

		render :json => {elapsed: elapsed, username: current_user.id}
	end

	def add_song
		response.headers['Content-Type'] = 'text/javascript'
		@song = Song.create(song_params)
		room = current_user.room
		room.songs << @song
    $redis.publish('rooms.add_song', {title: @song.title, room_id: current_user.room.id}.to_json)
    render nothing: true
		# render :json => true
	end

	def change_song
		room = current_user.room
		current_sc_link = params[:current_sc_link]

		ended_song = Song.where(sc_link: current_sc_link, room_id: room.id)
		ended_song.update_attributes(played: true)

		new_song = Song.where(played: false, room_id: current_user.room.id).limit(1)

		if new_song[0]
			render :json => {sc_link: new_song.sc_link}
		else
			songs = Song.where(played: true, room_id: room.id)
			
			songs.each do |song|
				song.update_attributes(played: false)
			end

			new_song = Song.where(played: false, room_id: room.id).limit(1)
			render :json => {sc_link: new_song.sc_link}
		end
	end

  def events
    response.headers['Content-Type'] = 'text/event-stream'
    sse = Streamer::SSE.new(response.stream)
    $redis = Redis.new
    # redis.subscribe(['rooms.add_user', 'rooms.add_song']) do |on|
    $redis.subscribe('rooms.add_song') do |on|
      on.message do |event, data|
      	# if event == 'rooms.add_song'
      		sse.write(data, event: 'rooms.add_song')
      	# elsif event == 'rooms.add_user'
       #  	sse.write(data, event: 'rooms.add_user')
      	# end
      end
    end
    render nothing: true
  rescue IOError
    # Client disconnected
  ensure
    $redis.quit
    sse.close
    # response.stream.close
  end

  def song_params
		params.require(:song).permit(:title, :artist, :stream_url, :album_art, :sc_ident)
	end

end 
