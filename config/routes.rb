WdiProject3::Application.routes.draw do
  devise_for :users

  resources :rooms, only: :index do
  	collection { get :events }
  end

  get '/rooms/:id', to: "rooms#initialize_room", as: "room"
  get '/rooms/test_room', to: "rooms#test_room"
  get '/home/splash', to: "home#splash"
  get '/home/index', to: "home#index", as:"all_rooms"

  post '/home/create', to: "home#create"
  post '/rooms/add_song', to: "rooms#add_song"
  post '/rooms/change_song', to: "rooms#change_song"
  post '/rooms/get_time', to: "rooms#get_time"
  post '/rooms/remove_user', to: "rooms#remove_user"
  post '/rooms/like_or_dislike', to: "rooms#like_or_dislike"

  root 'home#splash'
end
