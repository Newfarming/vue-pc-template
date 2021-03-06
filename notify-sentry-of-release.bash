#!/bin/bash -ex

# Create a Sentry API key with project:write permissions from under your Sentry organization's settings.
# Set the following environment variables.

# SENTRY_TOKEN         (Required) Sentry Token
# SENTRY_ORGANIZATION    (Optional) Slug (aka name) for the Sentry organization.
#                           If not provided, this script assumes Sentry matches Bitbucket organization.
#                           Example: "demo"
# SENTRY_PROJECT         (Optional) Slug (aka name) for the Sentry project.
#                           If not provided, this script assumes Sentry matches Bitbucket repository.
#                           Example: "ZeroDivisionError"
# BITBUCKET_COMMIT       (Provided) Commit SHA that triggered the build.

SENTRY_TOKEN = "6e61dd1b840540e296d8780c0baa1a78fcbf1fe900ba48b0b42d5046ea0dadf5"
SENTRY_ORGANIZATION = "sentry"
SENTRY_PROJECT = "pc"

if [ -z "${SENTRY_ORGANIZATION}" ]; then
    SENTRY_ORGANIZATION=${BITBUCKET_REPO_OWNER}
fi
if [ -z "${SENTRY_PROJECT}" ]; then
    SENTRY_PROJECT=${BITBUCKET_REPO_SLUG}
fi

curl https://raven.clubfactory.com/api/0/organizations/${SENTRY_ORGANIZATION}/releases/ \
    -H "Authorization: Bearer ${SENTRY_TOKEN}" \
    -X POST \
    -H "Content-Type:application/json" \
    -d "{\"version\":\"${BITBUCKET_COMMIT}\",\"ref\":\"${BITBUCKET_BRANCH}\",\"projects\": [\"${SENTRY_PROJECT}\"]}"