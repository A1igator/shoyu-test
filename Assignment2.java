import java.sql.*;
import java.util.HashMap;

public class Assignment2 {

	public Connection connection;

	public Assignment2() {
		try {
			Class.forName("org.postgresql.Driver");
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		}
	}

	public boolean connectDB(String URL, String username, String password) {
		try {
			connection = DriverManager.getConnection(URL, username, password);
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}

	public boolean disconnectDB() {
		try {
			connection.close();
		} catch (SQLException e) {
			return false;
		}
		return true;
	}

	public boolean insertPlayer(int id, String playerName, String email, String countryCode) {
		try {
			PreparedStatement ps = connection.prepareStatement("INSERT INTO Player VALUES (?, ?, ?, ?)");
			ps.setInt(1, id);
			ps.setString(2, playerName);
			ps.setString(3, email);
			ps.setString(4, countryCode);
			int i = ps.executeUpdate();
			if (i != 1) {
				throw new SQLException("failed");
			}
		} catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}

	public int getMembersCount(int gid) {
		try {
			PreparedStatement ps = connection.prepareStatement("SELECT COUNT(id) AS count FROM Player WHERE guild = ?");
			ps.setInt(1, gid);
			ResultSet rs = ps.executeQuery();
			if (rs.next()) {
				return rs.getInt("count");
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return -1;
	}

	public String getPlayerInfo(int id) {
		try {
			PreparedStatement ps = connection.prepareStatement("SELECT * FROM Player WHERE id = ?");
			ps.setInt(1, id);
			ResultSet rs = ps.executeQuery();
			if (rs.next()) {
				StringBuilder playerInfo = new StringBuilder();
				playerInfo.append(rs.getInt("id"));
				playerInfo.append(":");
				playerInfo.append(rs.getString("playername"));
				playerInfo.append(":");
				playerInfo.append(rs.getString("email"));
				playerInfo.append(":");
				playerInfo.append(rs.getString("country_code"));
				playerInfo.append(":");
				playerInfo.append(rs.getInt("coins"));
				playerInfo.append(":");
				playerInfo.append(rs.getInt("rolls"));
				playerInfo.append(":");
				playerInfo.append(rs.getInt("wins"));
				playerInfo.append(":");
				playerInfo.append(rs.getInt("losses"));
				playerInfo.append(":");
				playerInfo.append(rs.getInt("total_battles"));
				playerInfo.append(":");
				playerInfo.append(rs.getInt("guild"));
				return playerInfo.toString();
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return "";
	}

	public boolean changeGuild(String oldName, String newName) {
		try {
			PreparedStatement ps = connection.prepareStatement("UPDATE Guild SET guildname = ? WHERE guildname = ?");
			ps.setString(1, newName);
			ps.setString(2, oldName);
			int i = ps.executeUpdate();
			if (i != 1) {
				throw new SQLException("failed");
			}
		} catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}

	public boolean deleteGuild(String guildName) {
		try {
			PreparedStatement ps = connection.prepareStatement("DELETE FROM Guild WHERE guildname = ?");
			ps.setString(1, guildName);
			int i = ps.executeUpdate();
			if (i != 1) {
				throw new SQLException("failed");
			}
		} catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}

	public String listAllTimePlayerRatings() {
		try {
			PreparedStatement ps = connection.prepareStatement(
					"SELECT playername, all_time_rating FROM (Player JOIN PlayerRatings ON Player.id=PlayerRatings.p_id) GROUP BY playername, all_time_rating, month, year HAVING MAX(month) = month AND MAX(year) = year");
			ResultSet rs = ps.executeQuery();
			StringBuilder playerInfo = new StringBuilder();
			while (rs.next()) {
				playerInfo.append(rs.getString("playername"));
				playerInfo.append(":");
				playerInfo.append(rs.getInt("all_time_rating"));
				playerInfo.append(":");
			}
			return playerInfo.toString();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return "";
	}

	public boolean updateMonthlyRatings() {
		try {
			PreparedStatement selectRatingsPs = connection.prepareStatement("SELECT * FROM PlayerRatings");
			ResultSet ratingsRs = selectRatingsPs.executeQuery();
			HashMap<Integer, Double> playersExistMonthlyRating = new HashMap<>();
			HashMap<Integer, Double> playersExistAllTimeRating = new HashMap<>();
			while (ratingsRs.next()) {
				if (ratingsRs.getInt("year") == 2021 && ratingsRs.getInt("month") == 9) {
					int p_id = ratingsRs.getInt("p_id");
					playersExistMonthlyRating.put(p_id, ratingsRs.getInt("monthly_rating") * 1.1);
					playersExistAllTimeRating.put(p_id, ratingsRs.getInt("all_time_rating") * 1.1);
				}
			}
			PreparedStatement selectPlayerPs = connection.prepareStatement("SELECT * FROM Player");
			ResultSet playerRs = selectPlayerPs.executeQuery();
			while (playerRs.next()) {
				int id = playerRs.getInt("id");
				if (!playersExistMonthlyRating.containsKey(id)) {
					System.out.println(id);
					playersExistMonthlyRating.put(id, 1000.0);
					playersExistAllTimeRating.put(id, 1000.0);
				}
			}

			for (var playerExist : playersExistMonthlyRating.entrySet()) {
				PreparedStatement ps = connection
						.prepareStatement("INSERT INTO PlayerRatings VALUES (DEFAULT, ?, ?, ?, ?, ?)");
				int i = playerExist.getKey();
				System.out.println(playersExistAllTimeRating.get(i).intValue());
				ps.setInt(1, i);
				ps.setInt(2, 10);
				ps.setInt(3, 2021);
				ps.setInt(4, playersExistMonthlyRating.get(i).intValue());
				ps.setInt(5, playersExistAllTimeRating.get(i).intValue());
				int k = ps.executeUpdate();
				if (k != 1) {
					throw new SQLException("failed");
				}
			}

			PreparedStatement selectGuildRatingsPs = connection.prepareStatement("SELECT * FROM GuildRatings");
			ResultSet guildRatingsRs = selectGuildRatingsPs.executeQuery();
			HashMap<Integer, Double> guildsExistMonthlyRating = new HashMap<>();
			HashMap<Integer, Double> guildsExistAllTimeRating = new HashMap<>();
			while (guildRatingsRs.next()) {
				if (guildRatingsRs.getInt("year") == 2021 && guildRatingsRs.getInt("month") == 9) {
					int g_id = guildRatingsRs.getInt("g_id");
					guildsExistMonthlyRating.put(g_id, guildRatingsRs.getInt("monthly_rating") * 1.1);
					guildsExistAllTimeRating.put(g_id, guildRatingsRs.getInt("all_time_rating") * 1.1);
				}
			}
			PreparedStatement selectGuildPs = connection.prepareStatement("SELECT * FROM Guild");
			ResultSet guildRs = selectGuildPs.executeQuery();
			while (guildRs.next()) {
				int id = guildRs.getInt("id");
				if (!guildsExistMonthlyRating.containsKey(id)) {
					guildsExistMonthlyRating.put(id, 1000.0);
					guildsExistAllTimeRating.put(id, 1000.0);
				}
			}

			for (var guildExist : guildsExistMonthlyRating.entrySet()) {
				PreparedStatement ps = connection
						.prepareStatement("INSERT INTO GuildRatings VALUES (DEFAULT, ?, ?, ?, ?, ?)");
				int i = guildExist.getKey();
				ps.setInt(1, i);
				ps.setInt(2, 10);
				ps.setInt(3, 2021);
				ps.setInt(4, guildsExistMonthlyRating.get(i).intValue());
				ps.setInt(5, guildsExistAllTimeRating.get(i).intValue());
				int k = ps.executeUpdate();
				if (k != 1) {
					throw new SQLException("failed");
				}
			}
		} catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}

	public boolean createSquidTable() {
		try {
			PreparedStatement createPs = connection.prepareStatement("CREATE TABLE IF NOT EXISTS squidNation(\n"
					+ "id INTEGER PRIMARY KEY,\n" + "playername VARCHAR UNIQUE NOT NULL,\n"
					+ "email VARCHAR UNIQUE NOT NULL,\n" + "country_code CHAR(3) NOT NULL,\n"
					+ "coins INTEGER NOT NULL DEFAULT 0,\n" + "rolls INTEGER NOT NULL DEFAULT 0,\n"
					+ "wins INTEGER NOT NULL DEFAULT 0,\n" + "losses INTEGER NOT NULL DEFAULT 0,\n"
					+ "total_battles INTEGER NOT NULL DEFAULT 0,\n" + "guild INTEGER\n" + ");");
			createPs.executeUpdate();
			PreparedStatement ps = connection.prepareStatement(
					"SELECT * FROM (Player JOIN Guild ON Player.guild=Guild.id) WHERE guildname = ? AND country_code = ?");
			ps.setString(1, "Squid Game");
			ps.setString(2, "KOR");
			ResultSet rs = ps.executeQuery();
			if (rs.next()) {
				PreparedStatement insertPs = connection
						.prepareStatement("INSERT INTO squidNation VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
				insertPs.setInt(1, rs.getInt("id"));
				insertPs.setString(2, rs.getString("playername"));
				insertPs.setString(3, rs.getString("email"));
				insertPs.setString(4, rs.getString("country_code"));
				insertPs.setInt(5, rs.getInt("coins"));
				insertPs.setInt(6, rs.getInt("rolls"));
				insertPs.setInt(7, rs.getInt("wins"));
				insertPs.setInt(8, rs.getInt("losses"));
				insertPs.setInt(9, rs.getInt("total_battles"));
				insertPs.setInt(10, rs.getInt("guild"));
				int i = insertPs.executeUpdate();
				if (i != 1) {
					throw new SQLException("failed");
				}
			}
		} catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}

	public boolean deleteSquidTable() {
		try {
			PreparedStatement ps = connection.prepareStatement("DROP TABLE squidNation");
			ps.executeUpdate();
		} catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}
}
