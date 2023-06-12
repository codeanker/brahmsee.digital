#!/bin/sh
kubectl delete namespace brahmsee
kubectl create namespace brahmsee
helm install brahmsee ./brahmsee/ --namespace brahmsee --debug
