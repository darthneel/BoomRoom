WdiProject3::Application.routes.draw do
  devise_for :users

  root 'rooms#index'

  get '/rooms/test_room', to: "rooms#test_room"

  resources :rooms do
    collection { get :events }
  end

end
