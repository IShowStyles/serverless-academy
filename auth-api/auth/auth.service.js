import {AuthDTO} from "./auth.dto.js";

class AuthService {
  constructor() {

  }

  async login({username, password}) {

  }

  async register(req, res) {
    const {username, password, email} = req.body;
    const data = new AuthDTO({username, password, email});
    if (data.error.length) {
      throw new Error(data.error);
    }
    try {





    } catch (e) {
      res.status(500).json({
        message: e.message
      })
    }
  }
}

export default new AuthService();