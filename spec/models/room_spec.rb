require 'spec_helper'

describe Room do
	
	before :each do 
		@user = User.new(email: "test@aol.com", encrypted_password: "testpw")
		@song = Song.new()
		@room = Room.new()
	end

		it "shouild allow the user to join a room" do
		assert @room.users << @user
	end


end
