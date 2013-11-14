require 'spec_helper'

describe User do
	before :each do 
		# Create a user
		@email = 'test@aol.com'
		@username = 'tester'
		@password = 'password'
		@password_confirmation = 'password'
		@user = User.new(email: @email, username: @username, password: @password, password_confirmation: @password_confirmation)

		# Create a song
		@artist = 'Vampire Weekend'
		@title = 'Cousins'
		@stream_url = 'http://api.soundcloud.com/tracks/7077813/stream?client_id=6fd538372b02e1f99a4145ee258cda36'
		@sc_ident = 7077813
		@album_art = 'http://i1.sndcdn.com/artworks-000003087378-2evs9m-large.jpg?3eddc42'
		@genre = 'indie'
		@song = Song.new(artist: @artist, title: @title, stream_url: @stream_url, sc_ident: @sc_ident, album_art: @album_art, genre: @genre)

		# Create a room
		@name = 'test room'
		@room = Room.new(name: @name)

		# Associations
		@room.songs << @song
	end

	describe '#new_user' do
		it "should allow the user to sign up" do
			assert @user
		end
	end

	describe '#email' do
		it 'should return an email' do
			@user.email.should eq(@email)
		end
	end

	describe '#username' do
		it 'should return a username' do
			@user.username.should eq(@username)
		end
	end

	describe '#password' do
		it 'should return the password' do
			@user.password.should eq(@password)
		end
	end

	describe '#password_confirmation' do
		it 'should return the password again' do
			@user.password_confirmation.should eq(@password_confirmation)
		end
	end
end


