class HomeController < ApplicationController

	before_filter :authenticate_user!, :except => [:splash]

	def index
		@rooms = Room.all
		@room = Room.new
	end

	def splash
	end

	def create
		@room = Room.create(room_params)

		redirect_to room_path(@room)
	end

	def room_params
		params.require(:room).permit(:name)
	end

	def masonry_test
		@songs = Room.find(3).songs
	end

	def room
		@playlist = @room.songs.order('id')
	end



end
