# Hybrid Text Summarizer

Hybrid Text Summarizer is an advanced NLP system for generating concise, readable, and factually grounded summaries from long-form text. It uses a two-stage Filter-then-Generate pipeline that combines extractive sentence selection with abstractive rewriting, helping the system preserve important information while still producing fluent summaries.

The project is built around transformer-based models, including fine-tuned DistilRoBERTa for sentence scoring and fine-tuned BART-Large for abstractive summary generation. It supports both raw text input and PDF upload, making it useful for summarizing articles, reports, essays, research-style documents, lecture notes, and other long written content.

## Project Overview

This project focuses on hybrid text summarization. Instead of directly sending the entire input into a generative model, the system first filters the document to identify the most important sentences. Those selected sentences are then passed into a generative model that rewrites them into a cleaner and more natural summary.

The system is designed to handle text ranging from short paragraphs to long documents. For longer inputs, it uses intelligent chunking with sentence overlap so that context is not lost between sections. It also applies adaptive generation parameters based on input length, helping the model produce summaries that are neither too short nor unnecessarily long.

## Featured Technologies

- NLP
- Transformers
- BART
- DistilRoBERTa
- BERTScore
- Hugging Face
- PyTorch
- ROUGE
- PDF text extraction

## Main Features

- Two-stage hybrid summarization pipeline.
- Fine-tuned DistilRoBERTa for sentence classification and scoring.
- SBERT cosine similarity re-ranking by document relevance.
- Fine-tuned BART-Large for fluent abstractive summaries.
- Raw text summarization.
- PDF upload and automatic text extraction.
- Intelligent chunking for long-form documents.
- Configurable chunk overlap to preserve context.
- Length-adaptive generation parameters.
- Beam search for stronger generation quality.
- Token limits based on input size.
- Repetition penalties to reduce repeated phrases.
- Fact verification to reduce hallucinations.
- Proper noun correction and source-grounded cleanup.
- Post-processing for readability and grammar quality.
- Summary history for generated outputs.
- Compression statistics with input and output word counts.
- Built-in evaluation using ROUGE, BERTScore, coverage, novelty, and fact-verification metrics.
- Deterministic behavior through seeded randomness for reproducible results.

## How the Summarization Workflow Works

The summarization workflow follows a Filter-then-Generate approach:

1. Text is accepted from direct user input or extracted from an uploaded PDF.
2. The input is normalized and cleaned to remove unnecessary spacing, broken punctuation, repeated artifacts, and noisy formatting.
3. The document is split into sentences using robust sentence-splitting logic.
4. For long documents, the text is divided into manageable chunks.
5. Overlap is added between chunks so important ideas near chunk boundaries are not lost.
6. A fine-tuned DistilRoBERTa model scores sentences for importance.
7. SBERT-style semantic relevance can be used to re-rank selected sentences against the full document context.
8. The strongest sentences are selected as the extractive foundation.
9. A fine-tuned BART-Large model rewrites the selected content into an abstractive summary.
10. The generated summary is cleaned through post-processing, fact checks, repetition removal, and readability improvements.
11. Evaluation metrics are calculated to show compression, coverage, novelty, semantic similarity, and factual consistency.

## Two-Stage Pipeline

The first stage is extractive. A fine-tuned DistilRoBERTa model classifies and scores sentences based on how important they are to the document. This helps the system identify the most meaningful source content before generation begins.

The second stage is abstractive. A fine-tuned BART-Large model takes the extracted content and rewrites it into a fluent summary. This allows the final output to be more natural than a simple list of copied sentences.

Together, these stages give the system the strengths of both extractive and abstractive summarization: factual grounding from the source text and readable generated language.

## Chunking and Long Document Handling

Long documents are handled through an intelligent chunking strategy. The system splits large inputs into smaller sections while preserving sentence boundaries. It also applies configurable overlap between chunks so the summary does not lose context when ideas continue across section breaks.

Each chunk is processed separately, summarized, and then combined into a final summary. The final output is deduplicated and cleaned so repeated or overly similar sentences are removed.



## What Users Can Upload or Submit

Users can submit:

- Raw text.
- Long-form articles.
- Essays and reports.
- Notes and study material.
- PDF documents with extractable text.

After submission, the system returns a generated summary along with useful statistics such as word counts, compression ratio, processing mode, and processing time.

## Main Things Done in This Project

- Designed a two-stage Filter-then-Generate summarization pipeline.
- Fine-tuned DistilRoBERTa for sentence classification and importance scoring.
- Used SBERT cosine similarity for document-relevance based re-ranking.
- Fine-tuned BART-Large for abstractive summary generation.
- Built support for raw text input and PDF upload.
- Added automatic PDF text extraction.
- Added intelligent chunking for long-form text.
- Added overlap between chunks to preserve context.
- Added length-adaptive generation settings.
- Added post-processing for readable and cleaner summaries.

