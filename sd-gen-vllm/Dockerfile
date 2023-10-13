ARG CUDA_VERSION="11.8.0"
ARG CUDNN_VERSION="8"
ARG UBUNTU_VERSION="22.04"
# Base NVidia CUDA Ubuntu image
FROM nvidia/cuda:$CUDA_VERSION-cudnn$CUDNN_VERSION-devel-ubuntu$UBUNTU_VERSION as builder
# Use bash shell with pipefail option
SHELL ["/bin/bash", "-o", "pipefail", "-c"]
ENV PATH="/usr/local/cuda/bin:${PATH}"
WORKDIR /app
RUN apt-get update -y && \
    apt-get install -y python3 python3-pip git && \
    python3 -m pip install --upgrade pip && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    git clone https://github.com/vllm-project/vllm && \
    cd vllm && \
    pip wheel --no-cache-dir --no-deps --wheel-dir dist -r requirements.txt .
FROM nvidia/cuda:$CUDA_VERSION-cudnn$CUDNN_VERSION-runtime-ubuntu$UBUNTU_VERSION
# Use bash shell with pipefail option
SHELL ["/bin/bash", "-o", "pipefail", "-c"]
# Set the working directory
WORKDIR /
ENV MAX_NUM_BATCHED_TOKENS=2048
# ENV MODEL=facebook/opt-125m
# Prepare the models inside the docker image
ARG HUGGING_FACE_HUB_TOKEN=
ENV HUGGING_FACE_HUB_TOKEN=$HUGGING_FACE_HUB_TOKEN
# Prepare argument for the model and tokenizer
ARG MODEL_NAME=""
ENV MODEL_NAME=$MODEL_NAME
ARG MODEL_REVISION="main"
ENV MODEL_REVISION=$MODEL_REVISION
ARG MODEL_BASE_DIR="/hfdata/"
ENV MODEL_BASE_DIR=$MODEL_BASE_DIR
ARG TOKENIZER=
ENV TOKENIZER=$TOKENIZER
ARG STREAMING=
ENV STREAMING=$STREAMING
ENV HF_DATASETS_CACHE="/hfdata/huggingface-cache/datasets"
ENV HUGGINGFACE_HUB_CACHE="/hfdata/huggingface-cache/hub"
ENV TRANSFORMERS_CACHE="/hfdata/huggingface-cache/hub"
COPY --from=builder /app/vllm/requirements.txt /tmp/requirements.txt
COPY --from=builder /app/vllm/dist /tmp/dist

RUN rm -rf llama-2/*.safetensors
COPY llama-2/* /hfdata/

RUN apt-get update -y && \
    apt-get install -y python3 python3-pip && \
    python3 -m pip install --upgrade pip && \
    pip install --no-cache-dir -r /tmp/requirements.txt && \
    find /tmp/dist/*.whl | xargs pip install --no-cache-dir && \
    rm -f /tmp/requirements.txt && \
    rm -rf /tmp/dist && \
    apt-get remove -y python3-pip && \
    apt-get autoremove -y && \
    apt-get clean && \
    mkdir /data

#ADD scripts .
# Download the models
# RUN mkdir -p /model
# RUN MODEL_NAME=$MODEL_NAME MODEL_REVISION=$MODEL_REVISION MODEL_BASE_DIR=$MODEL_BASE_DIR HUGGING_FACE_HUB_TOKEN=$HUGGING_FACE_HUB_TOKEN python3 -u /download_model.py
EXPOSE 8000
ENTRYPOINT [ "sh", "-c" ]
CMD [ "python3 -m vllm.entrypoints.openai.api_server --host 0.0.0.0 --port 8000 --model /hfdata/ --download-dir $MODEL_BASE_DIR --max-num-batched-tokens $MAX_NUM_BATCHED_TOKENS --tokenizer /hfdata/"]