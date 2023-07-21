const { user } = require("../../models");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const data = req.body;
    const validasiEmail = await user.findOne({
      where: {
        email: data.email,
      },
    });

    if (validasiEmail === null) {
      const schema = Joi.object({
        nama: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
      });

      const { error } = schema.validate(data);

      if (error) {
        return res.status(400).send({
          status: "error",
          message: error.details[0].message,
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.password, salt);

      const newUser = await user.create({
        nama: data.nama,
        email: data.email,
        password: hashedPassword,
      });

      res.status(200).send({
        status: "success",
        data: {
          nama: newUser.nama,
          email: newUser.email,
          role: newUser.role,
          // password: hashedPassword,
        },
      });
    } else {
      res.status(500).send({
        status: "failed",
        message: "account already created",
      });
    }
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.login = async (req, res) => {
  const data = req.body;

  const schema = Joi.object({
    email: Joi.string().min(3).required(),
    password: Joi.string().min(8).required(),
  });

  const { error } = schema.validate(data);

  if (error) {
    return res.status(400).send({
      status: "error",
      message: error.details[0].message,
    });
  }

  try {
    const userExist = await user.findOne({
      where: {
        email: data.email,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (!userExist) {
      return res.status(400).send({
        status: "Failed",
        message: "email doesnt match",
      });
    }

    const isValid = await bcrypt.compare(data.password, userExist.password);

    if (!isValid) {
      return res.status(400).send({
        status: "Failed",
        message: "Password doesnt match",
      });
    }

    const dataToken = {
      id: userExist.id,
    };

    const token = jwt.sign(dataToken, process.env.TOKEN_KEY);

    res.status(200).send({
      status: "success...",
      data: {
        user: {
          id: userExist.dataValues.id,
          nama: userExist.dataValues.nama,
          email: userExist.dataValues.email,
        },
        token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.getUser = async (req, res) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send({
      message: "Please, Input Token!",
    });
  }

  try {
    const verified = jwt.verify(token, process.env.TOKEN_KEY);

    req.user = verified;

    const { id } = req.user;

    let data = await user.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["password"],
      },
    });

    data = JSON.parse(JSON.stringify(data));

    res.send({
      status: "success",
      data,
    });
  } catch (error) {
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};
