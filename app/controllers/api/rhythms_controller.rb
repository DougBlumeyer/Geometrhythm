module Api
  class RhythmsController < ApplicationController
    def create
      @rhythm = current_user.rhythms.new(rhythm_params)

      if @rhythm.save
        render json: @rhythm
      else
        render json: @rhythm.errors.full_messages, status: :unprocessable_entity
      end
    end

    def update
      @rhythm = Rhythm.find(params[:id])
      @rhythm.update(rhythm_params)
      render json: @rhythm
    end

    def index
      @rhythms = @rhythms.where(id: params[:id]) if params[:id]

      if params[:creator_id]
        @rhythms = Rhythm.where(creator_id: params[:creator_id])
      else
        @rhythms = Rhythm.all
      end

      if params[:rhythm_str]
        @rhythms = @rhythms.where(rhythm_str: params[:rhythm_str])
      end

      if params[:liker_id]
        @rhythms = @rhythms.where(id: User.find(params[:liker_id]).liked_rhythms)
      end

      render :all
    end

    def show
      @rhythm = Rhythm.find(params[:id])
      render :show
    end

    private

    def rhythm_params
      params.require(:rhythm).permit(:rhythm_str, :play_count)
    end
  end
end
