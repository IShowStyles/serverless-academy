import {SelectAllQuery, SelectQuery} from "../queries/index.js";
import Pool from "../db/index.js";
import {ConflictException, InternalServerErrorException} from "../exceptions/all.exceptions.js";

class UserService {
  async getAllUsers(req, res) {
    try {
      const users = await Pool.queries(SelectAllQuery('users'));
      if (!users) {
        throw new ConflictException('No users found');
      }
      return res.status(200).json({
        success: true,
        data: {
          ...users.rows
        }
      });
    } catch (e) {
      return res.status(404).json({
        success: false,
        message: e.message
      })
    }
  }

  async getUser(req, res) {
    try {
      const token = req.token;
      const data = await Pool.queries(SelectQuery('users', {accesstoken: token}));
      if (!data) {
        throw new ConflictException('No users found');
      }
      return res.status(200).json({
        success: true,
        data: {
          id: data.id,
          accessToken: data.accesstoken,
        }
      });
    } catch (e) {
      return res.status(404).json({
        success: false,
        message: e.message
      })
    }
  }
}

export default new UserService();