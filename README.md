## PokeLine
#### 世代における御三家の中で、 "どのポケモンを選択することがストーリーを最速で終わらせることに最適か" を議論する掲示板アプリ
https://poke-line.vercel.app/

## 開発期間
2023/2/7 ~ 21

サークルで主催していたイベント開催時期と重なり、実働できたのは10日間ぐらい。

稼働時間はおおよそ150時間程度。

## 技術Stack
Frontend: Next.js, TypeScript

Backend: Ruby on Rails (apiモード), MySQL (clearDB)

Infraなど: Git, GitHub, Docker, firebase認証(jwt), heroku, vercel

外部API: poke API

## 実装した機能
### 作品・世代の一覧表示機能
- 歴代の作品を発売開始日の昇順で並べた
- Next.jsのSGで静的データとして扱う

### 投稿機能
- 作品を選択後、御三家のうち任意の一体を選択し、タイトルと本文と共に投稿できる

### タイムライン(掲示板機能)
- ユーザーのこれまでの投稿が流れてくる
- スクロールに応じた無限ページネーションを実装。10投稿ごとにAPIを叩き、追加データを取得する。
- 自分の投稿はであれば、削除・更新が可能

### コメント機能
- タイムラインに存在する投稿にコメントができ、議論ができる
- コメントを送ると、相手に通知がいく
- コメントもスクロールに応じたページネーションを実装。APIの負荷とクライアントでの速度向上が目的。
- 自身のコメントであれば削除することができる
- コメントを投稿したユーザーも確認することができる

### 通知機能
- 自分以外のユーザーが自分の投稿にコメントをすると通知が発生する
- 通知はヘッダー右上で確認することができる
- 通知は無限スクロール型のページネーションで表示される
- 通知のアイコンを押した瞬間、表示されている未読通知は全て既読となる

### adminユーザーはアプリの使い方と開発ブログをISRで投稿できる
- adminユーザーはマークダウンを用いて記事の作成ができる
- 記事にはサムネイル画像を添付できる。
- マークダウンエディタにおいて、ドラックアンドドロップで画像を記事本文に埋め込むことが可能。画像はfirebase storageで管理
- 記事をISRでユーザーに配信する。
- adminユーザーしか記事のCUD操作はできない。

### ER図 (gem erdによって作成)
![erd_page-0001](https://user-images.githubusercontent.com/109059044/224117663-90480115-7ac6-4f20-8756-fd579bef35af.jpg)


### インフラ構成図
![infra drawio](https://user-images.githubusercontent.com/109059044/224115623-1d23001f-122e-448d-a34f-70392c9919ac.png)



当初はバックエンドはAWS EC2でホストしていましたが、CORSの問題が解決できず、時間も迫っていたためherokuに切り替えました。
