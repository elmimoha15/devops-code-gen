def generate_deployment_content(values: dict) -> str:
    name = values.get("name")
    replicas = values.get("replicas")
    image = values.get("image")
    containerPort = values.get("containerPort")
    envVars_str = values.get("envVars")

    if not all([name, replicas, image, containerPort]):
        raise ValueError("Missing required parameters for Kubernetes Deployment generation.")

    envVarsYaml = ""
    if envVars_str and envVars_str.strip() != "":
        env_vars_array = envVars_str.split(",")
        env_vars_list = []
        for env_var in env_vars_array:
            if "=" in env_var:
                key, value = env_var.split("=", 1)
                env_vars_list.append(f"            - name: {key.strip()}\n              value: \"{value.strip()}\"")
        if env_vars_list:
            envVarsYaml = f"\n          env:\n{chr(10).join(env_vars_list)}"

    return f"""apiVersion: apps/v1
kind: Deployment
metadata:
  name: {name}
  labels:
    app: {name}
spec:
  replicas: {replicas}
  selector:
    matchLabels:
      app: {name}
  template:
    metadata:
      labels:
        app: {name}
    spec:
      containers:
        - name: {name}
          image: {image}
          ports:
            - containerPort: {containerPort}{envVarsYaml}
          resources:
            limits:
              cpu: "500m"
              memory: "512Mi"
            requests:
              cpu: "100m"
              memory: "128Mi"
"""

def generate_service_content(values: dict) -> str:
    name = values.get("name")
    port = values.get("port")
    targetPort = values.get("targetPort")
    protocol = values.get("protocol")
    serviceType = values.get("serviceType")

    if not all([name, port, targetPort, protocol, serviceType]):
        raise ValueError("Missing required parameters for Kubernetes Service generation.")

    return f"""apiVersion: v1
kind: Service
metadata:
  name: {name}
spec:
  selector:
    app: {name}
  ports:
    - port: {port}
      targetPort: {targetPort}
      protocol: {protocol}
  type: {serviceType}
"""