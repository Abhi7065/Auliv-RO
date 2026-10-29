import {requireChatGPTUser} from '../chatgpt-auth';
import {isAdmin} from '../../lib/auliv';
import Dashboard from './dashboard';
export const dynamic='force-dynamic';
export const metadata={title:'Team dashboard | Auliv',robots:{index:false,follow:false}};
export default async function Admin(){await requireChatGPTUser('/admin');if(!await isAdmin())return <main className="privacy"><a href="/">← Auliv home</a><h1 style={{marginTop:40}}>Team access only</h1><p>Your signed-in account is not authorised for the Auliv dashboard. The site owner must configure ADMIN_EMAIL to match the team administrator’s ChatGPT email.</p><a className="button" href="/signout-with-chatgpt?return_to=/admin" target="_top">Sign out and switch account</a></main>;return <Dashboard/>}
