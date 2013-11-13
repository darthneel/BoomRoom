class CreateRooms < ActiveRecord::Migration
  def change
    create_table :rooms do |t|
      t.string :name, :unique => true
      t.timestamps
    end
  end
end
