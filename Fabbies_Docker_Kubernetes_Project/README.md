# Fabbies Restaurant Management System — Docker & Kubernetes Micro-Project

## What this project includes
- Demo login page (`index.html`)
- Restaurant menu categories: Vegetarian, Non-Vegetarian, Drinks, Ice Cream
- Add-to-cart, quantity changes, removal, automatic total
- Food customization, customer/contact details, delivery date/time/location
- Order summary confirmation
- Dockerfile and Docker Compose configuration
- Kubernetes Deployment and NodePort Service

## Important project scope
This is the same kind of front-end prototype described in the earlier Fabbies project report: HTML, CSS and JavaScript. Login is demo-only (`fabbies` / `1234`), and order data is stored only in browser session storage. There is no server-side authentication, payment processing, PHP backend, or MySQL database in this version. Do not claim persistent database order storage.

## 1. Run locally
Open `index.html` in a browser. Demo credentials:
- Username: `fabbies`
- Password: `1234`

## 2. Run using Docker
Install and start Docker Desktop. In PowerShell, change directory to this folder, then run:

```powershell
docker build -t fabbies-restaurant:1.0 .
docker run --rm -d --name fabbies-web -p 8080:80 fabbies-restaurant:1.0
```

Open http://localhost:8080

Check and stop:
```powershell
docker ps
docker logs fabbies-web
docker stop fabbies-web
```

## 3. Run using Docker Compose
```powershell
docker compose up -d --build
docker compose ps
docker compose logs
```
Open http://localhost:8080

Stop:
```powershell
docker compose down
```

## 4. Deploy to local Kubernetes with Minikube
Prerequisites: Docker Desktop, Minikube, kubectl. Start the cluster:
```powershell
minikube start --driver=docker
```

Build the image directly into Minikube's image store (so you do not need Docker Hub for a local demo):
```powershell
minikube image build -t fabbies-restaurant:1.0 .
```

Apply the Kubernetes resources:
```powershell
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl get deployments
kubectl get pods
kubectl get services
```

Open the site:
```powershell
minikube service fabbies-service
```
If you need to use the configured NodePort manually, run `minikube ip` and open `http://<MINIKUBE-IP>:30080` if your Minikube networking supports that route.

## 5. Demonstrate scaling
```powershell
kubectl scale deployment fabbies-deployment --replicas=3
kubectl get pods
```

## 6. Demonstrate self-healing
Get pod names:
```powershell
kubectl get pods
```
Delete one Fabbies pod, replacing `POD_NAME` with the actual pod name:
```powershell
kubectl delete pod POD_NAME
kubectl get pods
```
The Deployment should create a replacement pod.

## 7. Update the image
After editing files:
```powershell
docker build -t fabbies-restaurant:1.1 .
minikube image build -t fabbies-restaurant:1.1 .
```
Edit `k8s/deployment.yaml` to change the image to `fabbies-restaurant:1.1`, then run:
```powershell
kubectl apply -f k8s/deployment.yaml
kubectl rollout status deployment/fabbies-deployment
```

## Folder structure
```text
Fabbies_Docker_Kubernetes_Project/
├── index.html
├── micproj.html
├── style.css
├── login.js
├── app.js
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── README.md
└── k8s/
    ├── deployment.yaml
    └── service.yaml
```
