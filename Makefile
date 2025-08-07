PKG_MANAGER ?= npm

install:
	$(PKG_MANAGER) install

dev:
	$(PKG_MANAGER) run dev

build:
	$(PKG_MANAGER) run build

preview:
	$(PKG_MANAGER) run preview

docker-build:
	docker build -t askadb/ui:local .

docker-run:
	docker run --rm -p 5173:80 askadb/ui:local

