#!/usr/bin/ruby
# encoding: UTF-8
require "optimist"
require File.expand_path('../../../lib/recordandplayback', __FILE__)

opts = Optimist::options do
  opt :meeting_id, "Meeting id to archive", :type => String
  opt :format, "Playback format name", :type => String
end
meeting_id = opts[:meeting_id]

logger = Logger.new("/var/log/bigbluebutton/post_publish.log", 'weekly' )
logger.level = Logger::INFO
BigBlueButton.logger = logger

published_files = "/var/bigbluebutton/published/presentation/#{meeting_id}"
meeting_metadata = BigBlueButton::Events.get_meeting_metadata("/var/bigbluebutton/recording/raw/#{meeting_id}/events.xml")

def is_mp4_enabled(metadata)
  return metadata.key?("bbb-mp4-enabled") && metadata["bbb-mp4-enabled"].value == "true"
end

def get_callback_url(metadata)
  return metadata.key?("bbb-mp4-ready-url") ? metadata["bbb-mp4-ready-url"].value : nil
end


begin

  is_mp4_enabled = is_mp4_enabled(meeting_metadata)
  callback_url = get_callback_url(meeting_metadata)

  if is_mp4_enabled
    bbb_mp4_cmd = "bash /var/www/bigbluebutton-mp4-transcription/mp4/bbb-mp4.sh #{meeting_id} #{callback_url} &"
    status = system (bbb_mp4_cmd)
    BigBlueButton.logger.info("MP4 conversion started for #{meeting_id}: #{status}")
  else
    BigBlueButton.logger.info("MP4 conversion not enabled for #{meeting_id}")
  end


rescue => exception

end
