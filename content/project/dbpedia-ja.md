+++
title = "DBpedia Japanese mirror with Fuseki"
date = 2020-10-07T02:03:54+09:00
description = "DBpedia JapaneseのSPARQLエンドポイントミラー(Apache Jena Fuseki)"
tags = []
categories = ["SPARQL"]
aliases = [
    '/dbpedia-ja/'
]
+++

[DBpedia Japanese](http://ja.dbpedia.org/)のSPARQLエンドポイントを[Apache Jena Fuseki](https://jena.apache.org/documentation/fuseki2/)を使って提供しています。本家のVirtuosoとの比較がしたいことがあって立てたのですが、よろしければご利用ください。クエリの最大実行時間も寛大に設定してありますが、重量級のクエリはほどほどに。

提供しているデータセットは[2016-04-07版](http://ja.dbpedia.org/dumps/20160407/)です。 

{{< yasgui id="dbpedia-ja" endpoint="https://metadata.moe/sparql/dbpedia-ja/query" >}}