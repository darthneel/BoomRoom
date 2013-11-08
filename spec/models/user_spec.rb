require 'spec_helper'

describe User do

	before :each do 
		@user = User.new(email: "test@aol.com", encrypted_password: "testpw")
		@song = Song.new()
		@room = Room.new()
	end

	it "should allow the user to sign up" do
		assert @user
	end

	it "should allow the user to favorite a song" do
		assert @user.songs << @song
	end

end

