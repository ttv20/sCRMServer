'use strict'

const { validate } = use('Validator')
const User = use('App/Models/User')


/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with users
 */
class AuthController {
  /**
   * Show a list of all users.
   * GET users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async check ({ request, response }) {
    try {
      await auth.check()
    } catch (error) {
      response.send('You are not logged in')
    }
  }

  /**
   * Create/save a new user.
   * POST users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async register ({ request, response }) {
    const rules = {
      username: 'required|min:5|unique:users,username',
      email: 'required|email|unique:users,email',
      password: 'required|min:8'
    }
    const validation = await validate(request.all(), rules)
    
    if (validation.fails()){
      response.status(250)
      return response.send(validation.messages())
    }
    
    let user = await User.create(request.only(['username', 'password', 'email']))
    
    return response.send(user)
  }

  /**
   * Display a single user.
   * GET users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async login ({ request, response, auth }) {
    let params = request.all()
    
    const rules = {
      user: 'required|min:5',
      password: 'required|min:8'
    }
    const validation = await validate(request.all(), rules)
    validation.messages
    if (validation.fails()){
      response.status(250);
      return response.send(validation.messages())
    }
    
    let user = await User.query().where('username', params.user).orWhere('email', params.user).first()
    console.log(user)
    try {
      await auth
        .remember(params.remember)
        .attempt(user.email, params.password)
    } catch (error) {
      response.status(250)
      response.send('You are not logged in')
    }
    response.send(user)
  }

  /**
   * Render a form to update an existing user.
   * GET users/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async logout ({ response, auth }) {
    auth.logout()
    response.send()
  }

  /**
   * Update user details.
   * PUT or PATCH users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a user with id.
   * DELETE users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = AuthController
