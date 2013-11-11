class HomeController < ApplicationController

	before_filter :authenticate_user!


	def index
		@rooms = Room.all
	end

end
