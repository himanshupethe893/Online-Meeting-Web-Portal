use faculty_db;

SET GLOBAL event_scheduler = ON;
CREATE TABLE meeting (
    meeting_id INT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE EVENT delete_old_meetings
ON SCHEDULE EVERY 1 HOUR
DO
  DELETE FROM meeting WHERE created_at < NOW() - INTERVAL 1 DAY;
SHOW EVENTS;

SHOW CREATE EVENT delete_old_meetings;
