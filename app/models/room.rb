class Room < ActiveRecord::Base
	validates_uniqueness_of :name

	has_many :songs
	has_many :users
end
