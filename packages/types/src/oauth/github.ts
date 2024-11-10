import {z} from "zod";

/*
{
"login": "octocat",
"id": 1,
"node_id": "MDQ6VXNlcjE=",
"avatar_url": "https://github.com/images/error/octocat_happy.gif",
"gravatar_id": "",
"url": "https://api.github.com/users/octocat",
"html_url": "https://github.com/octocat",
"followers_url": "https://api.github.com/users/octocat/followers",
"following_url": "https://api.github.com/users/octocat/following{/other_user}",
"gists_url": "https://api.github.com/users/octocat/gists{/gist_id}",
"starred_url": "https://api.github.com/users/octocat/starred{/owner}{/repo}",
"subscriptions_url": "https://api.github.com/users/octocat/subscriptions",
"organizations_url": "https://api.github.com/users/octocat/orgs",
"repos_url": "https://api.github.com/users/octocat/repos",
"events_url": "https://api.github.com/users/octocat/events{/privacy}",
"received_events_url": "https://api.github.com/users/octocat/received_events",
"type": "User",
"site_admin": false,
"name": "monalisa octocat",
"company": "GitHub",
"blog": "https://github.com/blog",
"location": "San Francisco",
"email": "octocat@github.com",
"hireable": false,
"bio": "There once was...",
"twitter_username": "monatheoctocat",
"public_repos": 2,
"public_gists": 1,
"followers": 20,
"following": 0,
"created_at": "2008-01-14T04:33:35Z",
"updated_at": "2008-01-14T04:33:35Z",
"private_gists": 81,
"total_private_repos": 100,
"owned_private_repos": 100,
"disk_usage": 10000,
"collaborators": 8,
"two_factor_authentication": true,
"plan": {
  "name": "Medium",
  "space": 400,
  "private_repos": 20,
  "collaborators": 0
}
}
 */

export const GithubBearerTokenSchema = z.object({
  access_token: z.string(),
  scope: z.string(),
  token_type: z.string(),
});

export type GithubBearerToken = z.infer<typeof GithubBearerTokenSchema>;

export const GithubUserResponseSchema = z.object({
  login: z.string(),
});

export type GithubUserResponse = z.infer<typeof GithubUserResponseSchema>;

/*
[
  {
    "id": 861064515,
    "node_id": "R_kgDOM1LNQw",
    "name": "connections",
    "full_name": "cursive-team/connections",
    "private": false,
    "owner": {
      "login": "cursive-team",
      "id": 140554471,
      "node_id": "O_kgDOCGCw5w",
      "avatar_url": "https://avatars.githubusercontent.com/u/140554471?v=4",
      "gravatar_id": "",
      "url": "https://api.github.com/users/cursive-team",
      "html_url": "https://github.com/cursive-team",
      "followers_url": "https://api.github.com/users/cursive-team/followers",
      "following_url": "https://api.github.com/users/cursive-team/following{/other_user}",
      "gists_url": "https://api.github.com/users/cursive-team/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/cursive-team/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/cursive-team/subscriptions",
      "organizations_url": "https://api.github.com/users/cursive-team/orgs",
      "repos_url": "https://api.github.com/users/cursive-team/repos",
      "events_url": "https://api.github.com/users/cursive-team/events{/privacy}",
      "received_events_url": "https://api.github.com/users/cursive-team/received_events",
      "type": "Organization",
      "user_view_type": "public",
      "site_admin": false
    },
    "html_url": "https://github.com/cursive-team/connections",
    "description": "Cursive Connections",
    "fork": false,
    "url": "https://api.github.com/repos/cursive-team/connections",
    "forks_url": "https://api.github.com/repos/cursive-team/connections/forks",
    "keys_url": "https://api.github.com/repos/cursive-team/connections/keys{/key_id}",
    "collaborators_url": "https://api.github.com/repos/cursive-team/connections/collaborators{/collaborator}",
    "teams_url": "https://api.github.com/repos/cursive-team/connections/teams",
    "hooks_url": "https://api.github.com/repos/cursive-team/connections/hooks",
    "issue_events_url": "https://api.github.com/repos/cursive-team/connections/issues/events{/number}",
    "events_url": "https://api.github.com/repos/cursive-team/connections/events",
    "assignees_url": "https://api.github.com/repos/cursive-team/connections/assignees{/user}",
    "branches_url": "https://api.github.com/repos/cursive-team/connections/branches{/branch}",
    "tags_url": "https://api.github.com/repos/cursive-team/connections/tags",
    "blobs_url": "https://api.github.com/repos/cursive-team/connections/git/blobs{/sha}",
    "git_tags_url": "https://api.github.com/repos/cursive-team/connections/git/tags{/sha}",
    "git_refs_url": "https://api.github.com/repos/cursive-team/connections/git/refs{/sha}",
    "trees_url": "https://api.github.com/repos/cursive-team/connections/git/trees{/sha}",
    "statuses_url": "https://api.github.com/repos/cursive-team/connections/statuses/{sha}",
    "languages_url": "https://api.github.com/repos/cursive-team/connections/languages",
    "stargazers_url": "https://api.github.com/repos/cursive-team/connections/stargazers",
    "contributors_url": "https://api.github.com/repos/cursive-team/connections/contributors",
    "subscribers_url": "https://api.github.com/repos/cursive-team/connections/subscribers",
    "subscription_url": "https://api.github.com/repos/cursive-team/connections/subscription",
    "commits_url": "https://api.github.com/repos/cursive-team/connections/commits{/sha}",
    "git_commits_url": "https://api.github.com/repos/cursive-team/connections/git/commits{/sha}",
    "comments_url": "https://api.github.com/repos/cursive-team/connections/comments{/number}",
    "issue_comment_url": "https://api.github.com/repos/cursive-team/connections/issues/comments{/number}",
    "contents_url": "https://api.github.com/repos/cursive-team/connections/contents/{+path}",
    "compare_url": "https://api.github.com/repos/cursive-team/connections/compare/{base}...{head}",
    "merges_url": "https://api.github.com/repos/cursive-team/connections/merges",
    "archive_url": "https://api.github.com/repos/cursive-team/connections/{archive_format}{/ref}",
    "downloads_url": "https://api.github.com/repos/cursive-team/connections/downloads",
    "issues_url": "https://api.github.com/repos/cursive-team/connections/issues{/number}",
    "pulls_url": "https://api.github.com/repos/cursive-team/connections/pulls{/number}",
    "milestones_url": "https://api.github.com/repos/cursive-team/connections/milestones{/number}",
    "notifications_url": "https://api.github.com/repos/cursive-team/connections/notifications{?since,all,participating}",
    "labels_url": "https://api.github.com/repos/cursive-team/connections/labels{/name}",
    "releases_url": "https://api.github.com/repos/cursive-team/connections/releases{/id}",
    "deployments_url": "https://api.github.com/repos/cursive-team/connections/deployments",
    "created_at": "2024-09-21T22:46:40Z",
    "updated_at": "2024-11-05T20:26:37Z",
    "pushed_at": "2024-11-05T19:10:37Z",
    "git_url": "git://github.com/cursive-team/connections.git",
    "ssh_url": "git@github.com:cursive-team/connections.git",
    "clone_url": "https://github.com/cursive-team/connections.git",
    "svn_url": "https://github.com/cursive-team/connections",
    "homepage": "https://connections.cursive.team",
    "size": 16754,
    "stargazers_count": 6,
    "watchers_count": 6,
    "language": "TypeScript",
    "has_issues": true,
    "has_projects": true,
    "has_downloads": true,
    "has_wiki": false,
    "has_pages": false,
    "has_discussions": false,
    "forks_count": 2,
    "mirror_url": null,
    "archived": false,
    "disabled": false,
    "open_issues_count": 9,
    "license": null,
    "allow_forking": true,
    "is_template": false,
    "web_commit_signoff_required": false,
    "topics": [

    ],
    "visibility": "public",
    "forks": 2,
    "open_issues": 9,
    "watchers": 6,
    "default_branch": "main",
    "permissions": {
      "admin": true,
      "maintain": true,
      "push": true,
      "triage": true,
      "pull": true
    }
  }
]
*/

export const GithubRepoSchema = z.object({
  full_name: z.string(),
  language: z.string().nullable(),
})

export type GithubRepo = z.infer<typeof GithubRepoSchema>;

export const GithubReposResponseSchema = z.array(GithubRepoSchema);

export type GithubReposResponse = z.infer<typeof GithubReposResponseSchema>;
