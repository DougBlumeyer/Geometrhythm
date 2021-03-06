class SessionsController < ApplicationController
  before_action :only_logged_out!, only: [:new]

  def new
    @user ||= User.new
  end

  def create
    @user = User.find_by_credentials(
      params[:user][:email],
      params[:user][:password]
    )

    if @user.nil?
      flash.now[:notices] = ["Invalid credentials."]
      @user = User.new(email: params[:user][:email])
      render :new
    else
      login!(@user)
      redirect_to root_url
    end

  end

  def destroy
    logout!
    redirect_to root_url
  end
end
