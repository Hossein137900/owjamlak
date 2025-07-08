import  mongoose from "mongoose";

const FavoriteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  posters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Poster' }],
}, 
{ timestamps: true });
export default mongoose.models.Favorite || mongoose.model('Favorite', FavoriteSchema);