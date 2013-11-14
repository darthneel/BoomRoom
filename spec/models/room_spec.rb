require 'spec_helper'

describe Room do
	
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
		@room.users << @user
		@room.songs << @song
	end

	describe '#name' do
		it "should give the room a name" do
			@room.name.should eq(@name)
		end
	end

	describe '#associations' do
		it 'should contain users' do
			@room.users.first.should eq(@user)
		end

		it 'should contain songs' do
			@room.songs.first.should eq(@song)
		end
	end

end
