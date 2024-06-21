+++
title = "gBizINFO LOD"
description = "gBizINFOのSPARQLエンドポイント"
tags = []
categories = ["gBizINFO"]
+++

[gBizINFO](https://info.gbiz.go.jp/) でかつて提供されていた[SPARQL API バージョン 1.4](https://web.archive.org/web/2/https://info.gbiz.go.jp/api/document/API.pdf)と同等のデータを提供するSPARQLエンドポイントです。

データセットの生成については [Babibubebon/gbizinfo-lod](https://github.com/Babibubebon/gbizinfo-lod) をご覧ください。

-----

データ更新日: <date>`2024-06-18`</date>

Endpoint: `https://sparql.metadata.moe/gbizinfo/query`

{{< yasgui id="gbizinfo" endpoint="https://sparql.metadata.moe/gbizinfo/query" 
    default-query=`PREFIX hj: <http://hojin-info.go.jp/ns/domain/biz/1#>
PREFIX ic: <http://imi.go.jp/ns/core/rdf#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

SELECT *
FROM <http://hojin-info.go.jp/graph/hojin>
{ 
    ?s hj:法人基本情報 ?kihon. 
    ?kihon ic:ID/ic:識別値 ?hojinBango ;
           ic:名称 [ 
      		  ic:種別 '商号又は名称';
        	  ic:表記 ?name ;
           ]
    .
    OPTIONAL {
    	?kihon ic:名称 [ 
      	  	   ic:種別 '商号又は名称';
        	   ic:カナ表記 ?nameKana ;
           ]
    }
    OPTIONAL {
    	?kihon ic:名称 [ 
      	  	   ic:種別 '商号又は名称(英語表記)';
        	   ic:表記 ?nameEn ;
           ]
    }
    OPTIONAL {
    	?kihon ic:住所 [
     		ic:種別 '住所' ; 
     		ic:表記 ?address ;
        ]
    }
}
LIMIT 100`
>}}

## 名前付きグラフ

- 法人基本情報: `http://hojin-info.go.jp/graph/hojin`
- 補助金情報: `http://hojin-info.go.jp/graph/hojyokin`
- 調達情報: `http://hojin-info.go.jp/graph/chotatsu`
- 表彰情報: `http://hojin-info.go.jp/graph/hyosho`
- 届出認定情報: `http://hojin-info.go.jp/graph/todokede`
- 特許情報: `http://hojin-info.go.jp/graph/tokkyo`
- 職場情報: `http://hojin-info.go.jp/graph/shokuba`
- 財務情報: `http://hojin-info.go.jp/graph/zaimu`
- 共通コード: `http://hojin-info.go.jp/graph/commonCode`

デフォルトグラフは、上記の名前付きグラフの和集合ですが、パフォーマンス上明示的に指定したほうが良いです。
