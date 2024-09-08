import EmojiPicker, {
    Emoji,
    EmojiStyle,
    Theme as EmojiTheme,
  } from "emoji-picker-react";
  
  export function getEmojiUrl(unified: string, style: EmojiStyle) {
    // Whoever owns this Content Delivery Network (CDN), I am using your CDN to serve emojis
    // Old CDN broken, so I had to switch to this one
    // Author: https://github.com/H0llyW00dzZ
    return `https://fastly.jsdelivr.net/npm/emoji-datasource-apple/img/${style}/64/${unified}.png`;
  }
  
  export function AvatarPicker(props: {
    onEmojiClick: (emojiId: string) => void;
  }) {
    return (
      <EmojiPicker
        width={"100%"}
        lazyLoadEmojis
        theme={EmojiTheme.AUTO}
        getEmojiUrl={getEmojiUrl}
        onEmojiClick={(e) => {
          props.onEmojiClick(e.unified);
        }}
      />
    );
  }
  
  export function Avatar(props: { avatar?: string }) {
  
    return (
      <div className="user-avatar">
        {/* 表示props.avater有值，就渲染EmojiAvater */}
        {props.avatar && <EmojiAvatar avatar={props.avatar} />}
      </div>
    );
  }
  
  export function EmojiAvatar(props: { avatar: string; size?: number }) {
    return (
      <Emoji
        unified={props.avatar}
        size={props.size ?? 18}
        getEmojiUrl={getEmojiUrl}
      />
    );
  }
  