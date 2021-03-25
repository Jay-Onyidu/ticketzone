import axios from 'axios';

const buildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    //we are on the server

    return axios.create({
      //baseURL: 'http://ingress-nginx-controller.kube-system.svc.cluster.local',
      baseURL: 'http://www.ticketzone-app-prod.club/',
      headers: req.headers,
    });
  } else {
    //we are on the browser
    return axios.create({
      baseURL: '/',
    });
  }
};

export default buildClient;
