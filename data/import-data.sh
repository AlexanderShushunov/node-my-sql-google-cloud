#!/bin/sh
FILE_NAME=20210209_162154_apv_active_scores_gigya-000000000000.csv
BUCKET_NAME=apv-user-data
gsutil rm gs://${BUCKET_NAME}/${FILE_NAME}
gsutil cp ./${FILE_NAME} gs://${BUCKET_NAME}
# It does not rewrite the data :(
gcloud sql import csv apv-users gs://${BUCKET_NAME}/${FILE_NAME}  --database=users --table=users --quiet
