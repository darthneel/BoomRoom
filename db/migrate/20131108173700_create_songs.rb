class CreateSongs < ActiveRecord::Migration
  def change
    create_table :songs do |t|
      t.string :artist
      t.string :title
      t.string :stream_url      
      t.integer :sc_ident
      t.text :album_art
      t.string :genre
      t.boolean :played, :default => false
      t.boolean :currently_playing, :default => false
      t.integer :likes, :default => 0
      t.integer :dislikes, :default => 0
      t.string :added_by
      t.integer :room_id

      t.timestamps
    end
  end
end

