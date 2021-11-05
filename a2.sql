SET search_path TO A2;

-- group: solo

-- If you define any views for a question (you are encouraged to), you must drop them
-- after you have populated the answer table for that question.
-- Good Luck!

-- Query 1 --------------------------------------------------
CREATE VIEW active_players_count AS
SELECT p_id, COUNT(month) AS month_count FROM PlayerRatings
WHERE monthly_rating > 0
GROUP BY p_id;

CREATE VIEW lilmon_count_view AS
SELECT p_id, COUNT(l_id) AS lilmon_count FROM ((Player Join LilmonInventory ON LilmonInventory.p_id=Player.id) JOIN Lilmon ON Lilmon.id=LilmonInventory.l_id)
WHERE rarity = 5
GROUP BY p_id;

INSERT INTO Query1 (
        SELECT id,
        playername,
        email,
        CONCAT(
                CASE
                        WHEN rolls / month_count > 100 THEN 'whale' ELSE ''
                END,
                '-',
                CASE
                        WHEN lilmon_count / CAST(rolls as FLOAT) > 0.05 THEN 'lucky' ELSE ''
                END,
                '-',
                CASE
                        WHEN coins / month_count > 10000 THEN 'hoarder' ELSE ''
                END
        ) AS classification
        FROM ((active_players_count JOIN Player ON active_players_count.p_id=Player.id) JOIN lilmon_count_view ON lilmon_count_view.p_id=Player.id) AS active_players_info
);

DROP VIEW active_players_count;
DROP VIEW lilmon_count_view;

-- Query 2 --------------------------------------------------
CREATE VIEW limon_fav AS
SELECT * FROM LilmonInventory
WHERE in_team=TRUE OR fav=TRUE;

CREATE VIEW limon_fav_view AS
SELECT element1, element2 FROM (limon_fav JOIN Lilmon ON Lilmon.id=limon_fav.l_id) AS limon_fav_temp;

INSERT INTO Query2 (
        SELECT element, COUNT(DISTINCT element)
        FROM (SELECT element1 as element FROM limon_fav_view UNION SELECT element2 as element FROM limon_fav_view) AS limon_fav_elements
        GROUP BY element
);

DROP VIEW limon_fav_view;
DROP VIEW limon_fav;

-- Query 3 --------------------------------------------------
CREATE VIEW incomplete_games_view AS
SELECT id, (total_battles - (wins + losses)) AS incomplete_games
FROM Player;

CREATE VIEW active_players_count AS
SELECT p_id, COUNT(month) AS month_count FROM PlayerRatings
WHERE monthly_rating > 0
GROUP BY p_id;

CREATE VIEW incomplete_games_avg_view AS
SELECT id, (incomplete_games / month_count) AS incomplete_games_avg
FROM (active_players_count JOIN incomplete_games_view ON active_players_count.p_id=incomplete_games_view.id);

INSERT INTO Query3 (SELECT AVG(incomplete_games_avg) FROM incomplete_games_avg_view);

DROP VIEW incomplete_games_avg_view;
DROP VIEW active_players_count;
DROP VIEW incomplete_games_view;

-- Query 4 --------------------------------------------------
CREATE VIEW lilmon_pop_view AS
SELECT l_id, COUNT(DISTINCT l_id) AS lilmon_count
FROM LilmonInventory
GROUP BY l_id;

INSERT INTO Query4 (SELECT id, name, rarity, lilmon_count FROM (lilmon_pop_view JOIN Lilmon ON lilmon_pop_view.l_id=Lilmon.id));

DROP VIEW lilmon_pop_view;

-- Query 5 --------------------------------------------------
CREATE VIEW only_six_months_view AS
SELECT * FROM PlayerRatings
WHERE month >= EXTRACT(MONTH FROM (CURRENT_DATE - INTERVAL '6 months')) AND year >= EXTRACT(YEAR FROM (CURRENT_DATE - INTERVAL '6 months'));

INSERT INTO Query5 (
        SELECT p_id, playername, email, MIN(monthly_rating), MAX(monthly_rating)
        FROM (only_six_months_view JOIN Player ON only_six_months_view.p_id=Player.id)
        GROUP BY p_id, playername, email
        HAVING MAX(all_time_rating) >= 2000 AND MIN(monthly_rating) >= (MAX(monthly_rating) - 50)
);

DROP VIEW only_six_months_view;

-- Query 6 --------------------------------------------------
CREATE VIEW guild_count_view AS
SELECT guild, COUNT(DISTINCT guild) AS guild_count
FROM Player
GROUP BY guild;

CREATE VIEW all_time_rating_view AS
SELECT guild, guild_count, all_time_rating
FROM (guild_count_view JOIN GuildRatings ON guild_count_view.guild=GuildRatings.g_id)
GROUP BY guild, guild_count, all_time_rating, month, year
HAVING MAX(month) = month AND MAX(year) = year;

INSERT INTO Query6 (
        SELECT guild,
        guildname,
        tag,
        leader,
        playername,
        country_code,
        CASE
                WHEN guild_count < 100 THEN 'small'
                WHEN guild_count < 500 THEN 'medium'
                ELSE 'large'
        END,
        CASE
                WHEN guild_count < 100 THEN
                CASE
                        WHEN all_time_rating < 1000 THEN 'casual'
                        WHEN all_time_rating < 1500 THEN 'average'
                        ELSE 'elite'

                END
                WHEN guild_count < 500 THEN
                CASE
                        WHEN all_time_rating < 1750 THEN 'casual'
                        WHEN all_time_rating < 1250 THEN 'average'
                        ELSE 'elite'

                END
                ELSE
                CASE
                        WHEN all_time_rating < 2000 THEN 'casual'
                        WHEN all_time_rating < 1500 THEN 'average'
                        ELSE 'elite'

                END
        END
        FROM ((all_time_rating_view JOIN Guild ON all_time_rating_view.guild=Guild.id) AS guild_info JOIN (SELECT id, playername, country_code FROM Player) AS player_info ON guild_info.leader=player_info.id)
);

DROP VIEW all_time_rating_view;
DROP VIEW guild_count_view;

-- Query 7 --------------------------------------------------
CREATE VIEW active_players_count AS
SELECT p_id, COUNT(month) AS month_count FROM PlayerRatings
WHERE monthly_rating > 0
GROUP BY p_id;

CREATE VIEW active_player_countries AS
SELECT p_id, country_code, month_count FROM
(active_players_count JOIN Player ON active_players_count.p_id=Player.id);

INSERT INTO Query7 (
        SELECT country_code, AVG(month_count) FROM
        (SELECT DISTINCT country_code, month_count FROM active_player_countries) as country_averages
        GROUP BY country_code
);

DROP VIEW active_player_countries;
DROP VIEW active_players_count;

-- Query 8 --------------------------------------------------

CREATE VIEW guild_rate_view AS
SELECT guild, guildname, tag, SUM(wins) AS win_sum, SUM(total_battles) AS battle_sum FROM
(Guild JOIN Player ON Guild.id=Player.guild)
GROUP BY guild, guildname, tag;

INSERT INTO Query8 (
        SELECT
        id,
        playername,
        wins / CAST(total_battles AS FLOAT),
        Player.guild,
        guildname,
        tag,
        win_sum / CAST(battle_sum AS FLOAT)
        FROM (Player JOIN guild_rate_view ON Player.guild=guild_rate_view.guild)
);

DROP VIEW guild_rate_view;

-- Query 9 --------------------------------------------------
CREATE VIEW last_month_view AS
SELECT g_id, all_time_rating, monthly_rating
FROM GuildRatings
GROUP BY g_id, all_time_rating, monthly_rating, month, year
HAVING MAX(month) = month AND MAX(year) = year;

CREATE VIEW sort_view AS
SELECT g_id, all_time_rating, monthly_rating FROM last_month_view
ORDER BY
        all_time_rating ASC,
        monthly_rating ASC,
        g_id DESC
LIMIT 10;

CREATE VIEW pcount_view AS
SELECT guild, all_time_rating, monthly_rating, COUNT(Player.id) AS total_pcount, country_code, COUNT(DISTINCT country_code) AS country_pcount
FROM (sort_view JOIN Player ON sort_view.g_id=Player.guild)
GROUP BY guild, all_time_rating, monthly_rating, country_code;

INSERT INTO Query9 (
        SELECT guild,
        guildname,
        monthly_rating,
        all_time_rating,
        country_pcount,
        total_pcount,
        country_code
        FROM (pcount_view JOIN Guild ON pcount_view.guild=Guild.id)
        GROUP BY guild,
        guildname,
        monthly_rating,
        all_time_rating,
        country_pcount,
        total_pcount,
        country_code
        HAVING MAX(country_pcount) = country_pcount
);

DROP VIEW pcount_view;
DROP VIEW sort_view;
DROP VIEW last_month_view;

-- Query 10 --------------------------------------------------
CREATE VIEW player_vet_view AS
SELECT p_id, (COUNT(DISTINCT p_id) / CAST(12 AS FLOAT)) AS player_vet
FROM PlayerRatings
GROUP BY p_id;

INSERT INTO Query10 (
        SELECT guild, guildname, AVG(player_vet)
        FROM ((player_vet_view JOIN Player ON player_vet_view.p_id=Player.id) AS player_vet_info JOIN Guild ON player_vet_info.guild=Guild.id)
        GROUP BY guild, guildname
);

DROP VIEW player_vet_view;