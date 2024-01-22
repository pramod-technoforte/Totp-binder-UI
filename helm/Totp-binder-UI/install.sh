#!/bin/bash
# Installs Totp-binder-UI helm charts
## Usage: ./install.sh [kubeconfig]

if [ $# -ge 1 ] ; then
  export KUBECONFIG=$1
fi

NS=esignet
CHART_VERSION=1.2.0

echo Create $NS namespace
kubectl create ns $NS

function installing_Totp-binder-UI() {
  echo Istio label
  kubectl label ns $NS istio-injection=enabled --overwrite

  helm repo add mosip https://mosip.github.io/mosip-helm
  helm repo update

  echo Copy configmaps
  ./copy_cm.sh

  ESIGNET_HOST=$(kubectl get cm global -o jsonpath={.data.mosip-esignet-host})

  echo Installing OIDC UI
  helm -n $NS install Totp-binder-UI mosip/Totp-binder-UI \
  --set oidc_ui.configmaps.Totp-binder-UI.REACT_APP_API_BASE_URL="http://esignet.$NS/v1/esignet" \
  --set oidc_ui.configmaps.Totp-binder-UI.REACT_APP_SBI_DOMAIN_URI="http://esignet.$NS" \
  --set oidc_ui.configmaps.Totp-binder-UI.OIDC_UI_PUBLIC_URL=''\
  --set istio.hosts\[0\]=$ESIGNET_HOST \
  --version $CHART_VERSION

  kubectl -n $NS  get deploy -o name |  xargs -n1 -t  kubectl -n $NS rollout status

  echo Installed Totp-binder-UI
  return 0
}

# set commands for error handling.
set -e
set -o errexit   ## set -e : exit the script if any statement returns a non-true return value
set -o nounset   ## set -u : exit the script if you try to use an uninitialised variable
set -o errtrace  # trace ERR through 'time command' and other functions
set -o pipefail  # trace ERR through pipes
installing_Totp-binder-UI   # calling function
