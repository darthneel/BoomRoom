class CreateFavoriteSongsUsersTable < ActiveRecord::Migration
  def change
    create_table :favorite_songs_users, :id => false do |t|
    	t.integer :favorite_song_id
    	t.integer :user_id

    	t.timestamps

    end
  end
end
