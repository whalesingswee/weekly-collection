/* global */
javascript: (function () {

  var member = ['Rplus', 'whalesingswee', 'amazingandyyy'];

  var weight = {
    likes: 1,      /* 互動基數 */
    comments: 1.5, /* 鼓勵討論 */
    shares: 2,     /* 鼓勵擴散 */
    vote: 3        /* 些微調整 */
  };

  var comments = [].slice.call(document.querySelectorAll('.timeline-comment-wrapper'));

  var targetComments = comments.filter((comment) => {
    var firstTd = comment.querySelector('tbody td');
    return !!firstTd && /^\# \d+/.test(firstTd.textContent);
  });

  var emojisData = targetComments.map((t) => {
    var reactionBtn = [].slice.call(t.querySelectorAll('.comment-reactions-options .reaction-summary-item'));

    return reactionBtn.map((btn) => {
      return {
        reaction: btn.value.split(/\s+/)[0],
        who: btn.getAttribute('aria-label').replace(/,| and/g, '').split(/\s+/)
      };
    });
  });

  var sumTable = emojisData.map((emojis, idx) => {
    var voteData = {};
    var _id = targetComments[idx].querySelector('.comment-body a').href.replace('https://fb.com/', '');

    console.log(_id);

    var tds = [].slice.call(targetComments[idx].querySelectorAll('tbody td'));
    var tdsData = tds.map((td) => {
      return td.textContent;
    });

    [voteData.order, voteData.likes, voteData.comments, voteData.shares] = tdsData;

    voteData.vote = 0;

    emojis.forEach((emoji) => {
      var reaction = emoji.reaction;
      var people = emoji.who;

      people.forEach((t) => {
        voteData[t] = reaction;
      });
    });

    Object.keys(voteData).forEach((i) => {
      if (!member.includes(i)) { return; }
      if (voteData[i] === '+1') {
        voteData.vote += 1;
      } else if (voteData[i] === 'thinking_face') {
        voteData.vote -= 1;
      }
    });

    voteData.calcSum = voteData.likes * weight.likes + voteData.comments * weight.comments + voteData.shares * weight.shares + voteData.vote * weight.vote;

    voteData.postId = _id;

    return voteData;
  });

  window.sumTable = sumTable;

  console.table(sumTable);
})();
