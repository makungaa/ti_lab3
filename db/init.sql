PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS Comments;
DROP TABLE IF EXISTS Posts;

CREATE TABLE Posts (
                       Id INTEGER PRIMARY KEY AUTOINCREMENT,
                       Title TEXT NOT NULL,
                       Body TEXT NOT NULL,
                       CreatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE Comments (
                          Id INTEGER PRIMARY KEY AUTOINCREMENT,
                          PostId INTEGER NOT NULL,
                          Author TEXT NOT NULL,
                          Body TEXT NOT NULL,
                          CreatedAt TEXT NOT NULL DEFAULT (datetime('now')),
                          Approved INTEGER NOT NULL DEFAULT 0,
                          FOREIGN KEY (PostId) REFERENCES Posts(Id) ON DELETE CASCADE
);

CREATE INDEX IX_Comments_Post ON Comments(PostId, Approved, CreatedAt);

INSERT INTO Posts(Title, Body)
VALUES ('Pierwszy post', 'Witaj w blogu demo');

INSERT INTO Comments(PostId, Author, Body)
VALUES (1, 'Ala', 'Brawo!');
