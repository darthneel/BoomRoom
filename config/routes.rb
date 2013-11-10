WdiProject3::Application.routes.draw do
  devise_for :users

  root 'rooms#index'

  get '/rooms/test_room', to: "rooms#test_room"

  get '/rooms/:id', to: "rooms#initialize_room", as: "room"

  get '/rooms/events', to: "rooms#events", as: "events_rooms"

  post '/rooms/add_song', to: "rooms#add_song"
end
