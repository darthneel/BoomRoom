class HomeController < ApplicationController

	skip_before_filter :authenticate_user!, :only => [:splash]

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


end
