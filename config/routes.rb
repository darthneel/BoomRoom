WdiProject3::Application.routes.draw do
  devise_for :users

  resources :rooms do
    collection { get :events }
  end

  root 'rooms#index'
end
