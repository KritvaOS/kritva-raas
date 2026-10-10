#==============================================================================
# Copyright (c) 2026 KritvaOS
# SPDX-License-Identifier: LicenseRef-KritvaOS-Proprietary
#
# File        : Makefile
# Description : Kritva RaaS repository validation and development commands
#
# Component   : Infrastructure
# Module      : Development Commands
# Layer       : Development Infrastructure
#
# Requirements: KR-BINC-001-019
# API         : GNU Make
#
# Author      : KritvaOS
# Created     : 10-10-2026
#==============================================================================

#------------------------------------------------------------------------------
# Project Configuration
#------------------------------------------------------------------------------

PROJECT_NAME := kritva-raas

SCRIPT_DIR := scripts
TEST_DIR   := tests

PYTHON := python3

#------------------------------------------------------------------------------
# Default Target
#------------------------------------------------------------------------------

.DEFAULT_GOAL := help

#------------------------------------------------------------------------------
# Help
#
# Targets containing "##" are automatically displayed by "make help".
#------------------------------------------------------------------------------

.PHONY: help

help: ## Show available development commands
	@echo ""
	@echo "Kritva RaaS - Development Commands"
	@echo "=================================="
	@echo ""
	@grep -E '^[a-zA-Z0-9_-]+:.*##' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS=":.*## "}; {printf "  %-20s %s\n", $$1, $$2}'
	@echo ""

#------------------------------------------------------------------------------
# Source Header Check
#
# Same commands as .github/workflows/source-header-check.yml.
# The checker decides which tracked files require a header
# (docs/development/SOURCE_HEADER_STANDARD.md).
#------------------------------------------------------------------------------

.PHONY: header-test header-check

header-test: ## Run the source header checker unit tests
	@echo "[header-test] Running source header checker tests..."
	$(PYTHON) -m unittest discover -s $(TEST_DIR)/source_header_check -v

header-check: ## Validate KritvaOS source headers (strict, tracked files)
	@echo "[header-check] Validating KritvaOS source headers..."
	$(PYTHON) $(SCRIPT_DIR)/lint/check_source_headers.py \
		--mode tracked --strict

#------------------------------------------------------------------------------
# Documentation and Planning Traceability
#
# Same commands as .github/workflows/docs-check.yml.
#------------------------------------------------------------------------------

.PHONY: docs-check traceability-check

docs-check: ## Validate documentation structure, phases and milestones
	@echo "[docs-check] Validating documentation..."
	$(PYTHON) $(SCRIPT_DIR)/docs/check_docs.py

traceability-check: ## Validate backend increment dossier traceability
	@echo "[traceability] Validating backend increment traceability..."
	$(PYTHON) $(SCRIPT_DIR)/docs/check_backend_traceability.py

#------------------------------------------------------------------------------
# Repository Validation
#
# "make check" runs every check that CI requires on main (ruleset 24843399)
# and is the local validation command before opening a pull request.
#
# The Git pre-commit hook stays lightweight and runs only the header check.
#------------------------------------------------------------------------------

.PHONY: check

check: header-test header-check docs-check traceability-check ## Run all repository checks required by CI
	@echo ""
	@echo "[check] All repository checks passed."

#------------------------------------------------------------------------------
# Git Hooks
#------------------------------------------------------------------------------

.PHONY: hooks-install

hooks-install: ## Enable the repository Git hooks (.githooks/pre-commit)
	git config core.hooksPath .githooks
	@echo "[hooks] core.hooksPath set to .githooks"

#------------------------------------------------------------------------------
# Application Build, Test, Lint and Format
#
# Not configured yet. They depend on the open B-INC-001 toolchain decisions:
# runtime and language (KR-BINC-001-001), package manager (KR-BINC-001-002),
# HTTP framework (KR-BINC-001-003) and migration tool (KR-BINC-001-004).
# These targets fail deliberately so that nothing reports a build or test
# result that did not happen. They are not part of "make check".
#------------------------------------------------------------------------------

.PHONY: build test lint format format-check

NOT_CONFIGURED = @echo "[$@] Not configured: pending toolchain decisions KR-BINC-001-001 to KR-BINC-001-004."; exit 1

build: ## Build the application (not configured yet; fails)
	$(NOT_CONFIGURED)

test: ## Run application tests (not configured yet; fails)
	$(NOT_CONFIGURED)

lint: ## Run application lint (not configured yet; fails)
	$(NOT_CONFIGURED)

format: ## Format application sources (not configured yet; fails)
	$(NOT_CONFIGURED)

format-check: ## Check application formatting (not configured yet; fails)
	$(NOT_CONFIGURED)

#------------------------------------------------------------------------------
# Clean
#------------------------------------------------------------------------------

.PHONY: clean

clean: ## Remove Python caches created by the repository tools
	@echo "[clean] Removing Python caches..."
	find . -name '__pycache__' -type d -prune -exec rm -rf {} +

#------------------------------------------------------------------------------
# Information
#------------------------------------------------------------------------------

.PHONY: info

info: ## Show project and tool configuration
	@echo ""
	@echo "Kritva RaaS Configuration"
	@echo "========================="
	@echo "Project       : $(PROJECT_NAME)"
	@echo "Script dir    : $(SCRIPT_DIR)"
	@echo "Test dir      : $(TEST_DIR)"
	@echo "Python        : $(PYTHON)"
	@echo "Hooks path    : $$(git config --get core.hooksPath || echo '(not set)')"
	@echo ""
