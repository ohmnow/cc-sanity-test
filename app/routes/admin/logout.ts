import {redirect} from 'react-router'
import {clearAdminSession} from '~/lib/admin.server'

import type {Route} from './+types/logout'

export async function action({request}: Route.ActionArgs) {
  const sessionCookie = await clearAdminSession()
  throw redirect('/admin/login', {
    headers: {
      'Set-Cookie': sessionCookie,
    },
  })
}

export async function loader() {
  throw redirect('/admin')
}
