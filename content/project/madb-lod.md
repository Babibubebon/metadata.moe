+++
title = "メディア芸術データベース LOD (Unofficial)"
date = 2020-10-07T02:03:54+09:00
description = "メディア芸術データベース(ベータ版)をLOD化したデータセット"
tags = []
categories = ["SPARQL"]
aliases = [
    '/madb-lod/'
]
+++

[メディア芸術データベース (ベータ版)](https://mediaarts-db.bunka.go.jp/)が試験的に公開している[Web API](https://mediaarts-db.bunka.go.jp/about#anc02)から取得したデータを RDF へ変換して作成したデータセットです。

- [変換スクリプト](https://github.com/Babibubebon/MADB-LOD)
- [RDF データダンプ](./dumps/)

## Query with SPARQL

{{< yasgui id="madb-lod" endpoint="https://metadata.moe/sparql/madb/query"
default-query=`PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX ma: <https://metadata.moe/ns/madb/ma#>
SELECT * WHERE {
  ?sub ?pred ?obj .
} LIMIT 10`
>}}

### Examples
- {{< yasgui-query yasgui-id="madb-lod" title="公開年毎にTVアニメ数を集計する"
query=`PREFIX schema: <http://schema.org/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX ma: <https://metadata.moe/ns/madb/ma#>
SELECT ?y (COUNT(DISTINCT *) AS ?cnt)  WHERE {
  ?s a ma:Collection ;
     ma:media "TVレギュラー" ;
     schema:startDate ?startDate .
}
GROUP BY (SUBSTR(?startDate, 1, 4) AS ?y)
ORDER BY DESC(?y)
` >}}

- {{< yasgui-query yasgui-id="madb-lod" title="タイトルに「!」「?」を多く含むTVアニメを取得する "
query=`PREFIX schema: <http://schema.org/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX ma: <https://metadata.moe/ns/madb/ma#>
SELECT ?s ?name ?mark WHERE {
  ?s a ma:Collection ;
     ma:media "TVレギュラー" ;
     schema:name ?name .
  FILTER(LANG(?name) = "")
  FILTER (REGEX(?name, "[!！\\?？]+"))
  BIND (REPLACE(?name, "[^!！\\?？]*([!！\\?？]+)[^!！\\?？]*", "$1") AS ?mark)
}
ORDER BY DESC(STRLEN(?mark))
LIMIT 100
` >}}

- {{< yasgui-query yasgui-id="madb-lod" title="岡田麿里さん参加作品を取得する"
query=`PREFIX schema: <http://schema.org/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX ma: <https://metadata.moe/ns/madb/ma#>

SELECT
	?col ?colName (GROUP_CONCAT(DISTINCT ?role) AS ?roles)
WHERE {
  ?col a ma:Collection ;
         ma:media ?media ;
         schema:name ?colName ;
         ^schema:isPartOf ?item .
  VALUES ?media {"TVレギュラー" "劇場上映" "TVスペシャル"}
  {
  	?col schema:contributor ?contributers .
  } UNION {
    ?item schema:contributor ?contributers .
  }
  FILTER(LANG(?colName) = "")
  FILTER(REGEX(?contributers, "岡田\\s*麿里"))
  BIND(REPLACE(?contributers, ".*\\[(.+?)\\]岡田\\s*麿里.*", "$1") AS ?role)
}
GROUP BY ?col ?colName
` >}}

---

## ご利用にあたって

- 本データセットは、[文化庁「メディア芸術データベース（ベータ版）」](https://mediaarts-db.bunka.go.jp/)を加工して作成したものです。
- ![CC BY 4.0](https://licensebuttons.net/l/by/4.0/88x31.png)  
  本データセットは、[クリエイティブ・コモンズ 表示 4.0 国際 ライセンス](http://creativecommons.org/licenses/by/4.0/)の下に提供されています。[メディア芸術データベース 利用規約](https://mediaarts-db.bunka.go.jp/user_terms)も併せてお読みください。
- 本データセットは、個人が独自に提供しているものですので、文化庁にお問い合わせされないようご注意ください。連絡先は[こちら](https://babibubebo.org/about/contact/)か、内容に応じて[GitHub の issue](https://github.com/Babibubebon/MADB-LOD/issues)にお願いします。
