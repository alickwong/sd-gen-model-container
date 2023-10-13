from huggingface_hub import snapshot_download

HF_MODEL_ID="meta-llama/Llama-2-7b-hf"
HF_TOKEN=<YOUR HUGGING FACE TOKEN>

model_dir = snapshot_download(repo_id=HF_MODEL_ID,
							  token=HF_TOKEN,
                              #ignore_patterns=["*.safetensors"],
                              cache_dir="./",
                              local_dir = "./model",
                              local_dir_use_symlinks=False)

# Test if the model can load locally (Ref: https://huggingface.co/blog/llama2)
from transformers import AutoTokenizer
import transformers
import torch

tokenizer = AutoTokenizer.from_pretrained('./model')
pipeline = transformers.pipeline(
    "text-generation",
    model='./model',
    torch_dtype=torch.float16,
    device_map="auto",
)

sequences = pipeline(
    'I liked "Breaking Bad" and "Band of Brothers". Do you have any recommendations of other shows I might like?\n',
    do_sample=True,
    top_k=10,
    num_return_sequences=1,
    eos_token_id=tokenizer.eos_token_id,
    max_length=200,
)
for seq in sequences:
    print(f"Result: {seq['generated_text']}")