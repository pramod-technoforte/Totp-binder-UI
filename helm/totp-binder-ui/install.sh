#!/bin/bash
# Installs totp-binder-ui helm charts
## Usage: ./install.sh [kubeconfig]

if [ $# -ge 1 ] ; then
  export KUBECONFIG=$1
fi

NS=totp
CHART_VERSION=1.2.0

echo Create $NS namespace
kubectl create ns $NS

function installing_totp-binder-ui() {
  echo Istio label
  kubectl label ns $NS istio-injection=enabled --overwrite

  helm repo update
  helm dependency update

  echo Copy configmaps
  ./copy_cm.sh

  TOTP_BINDER_UI_HOST=$(kubectl get cm global -o jsonpath={.data.mosip-totp-binder-service-host})
  TOTP_BINDER_SERVICE_HOST=$(kubectl get cm global -o jsonpath={.data.mosip-api-internal-host})
  ESIGNET_HOST=$(kubectl get cm global -o jsonpath={.data.mosip-esignet-host})

  echo Installing TOTP-BINDER UI
  helm -n $NS install totp-binder-ui $HOME/totp-binder-ui/helm/totp-binder-ui/totp-binder-ui \
  --set totp_binder_ui.totp_binder_service_url="https://$TOTP_BINDER_SERVICE_HOST/v1/totp" \
  --set totp_binder_ui.ESIGNET_UI_BASE_URL="https://$ESIGNET_HOST" \
  --set totp_binder_ui.REDIRECT_URI="https://$TOTP_BINDER_UI_HOST/qrcode" \
  --set istio.hosts\[0\]=$TOTP_BINDER_UI_HOST \
  --version $CHART_VERSION

  kubectl -n $NS  get deploy -o name |  xargs -n1 -t  kubectl -n $NS rollout status

  echo Installed totp-binder-ui
  return 0
}

# set commands for error handling.
set -e
set -o errexit   ## set -e : exit the script if any statement returns a non-true return value
set -o nounset   ## set -u : exit the script if you try to use an uninitialised variable
set -o errtrace  # trace ERR through 'time command' and other functions
set -o pipefail  # trace ERR through pipes
installing_totp-binder-ui   # calling function
