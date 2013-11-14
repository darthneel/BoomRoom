require 'spec_helper'

describe Song do
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

	describe '#artist' do
		it 'should return an artist' do
			@song.artist.should eq(@artist)
		end
	end

	describe '#title' do
		it 'should return a song title' do
			@song.title.should eq(@title)
		end
	end

	describe '#stream_url' do
		it 'should return a SoundCloud stream URL' do
			@song.stream_url.should eq(@stream_url)
		end
	end

	describe '#sc_ident' do
		it 'should return a SoundCloud id' do
			@song.sc_ident.should eq(@sc_ident)
		end
	end

	describe '#album_art' do
		it 'should return the song album art' do
			@song.album_art.should eq(@album_art)
		end
	end

	describe '#genre' do
		it 'should return a genre' do
			@song.genre.should eq(@genre)
		end
	end

	describe '#likes' do
		it 'should return the amount of likes' do
			@song.likes.should eq(0)
		end
	end

	describe '#dislikes' do
		it 'should return the amount of dislikes' do
			@song.dislikes.should eq(0)
		end
	end

	describe '#played' do
		it 'should return if the song has been played' do
			@song.played.should eq(false)
		end
	end

	describe '#currently_playing' do
		it 'should return is the song is currently playing' do
			@song.currently_playing.should eq(false)
		end
	end
end
