require 'streamer/sse'

class RoomsController < ApplicationController
	include ActionController::Live

	# before_filter :authenticate_user!

	def index
	end

	def test_room
	end

# Might need to be moved depending on how we want to trigger it (room show, for example)
	def add_user
    response.headers['Content-Type'] = 'text/javascript'
    if current_user
	    $redis.publish('rooms.add_user', {username: current_user.username, room_id: current_user.room.id}.to_json)
	  end
    render nothing: true
	end

	def get_time
		current_song = Song.where(currently_playing: true)
		elapsed = Time.now - current_song.updated_at

		render :json => {elapsed: elapsed, username: current_user.username}
	end

	def add_song
		song = Song.new(params[:song])
		room = current_user.room

		if song.save
			room.songs << song
			render :json => true
		else
			render :json => false
		end
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
    redis = Redis.new
    redis.subscribe('rooms.add_user') do |on|
      on.username do |event, data|
        sse.write(data, event: 'rooms.add_user')
      end
    end
    render nothing: true
  rescue IOError
    # Client disconnected
  ensure
    redis.quit
    sse.close
  end
end 
