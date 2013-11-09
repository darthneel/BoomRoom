class CreateFavoriteSongs < ActiveRecord::Migration
  def change
    create_table :favorite_songs do |t|
      t.string :artist
      t.string :title
      t.string :sc_link
      

      t.timestamps
    end
  end
end
